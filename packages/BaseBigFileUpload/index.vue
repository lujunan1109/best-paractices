<template>
  <div id="global-uploader">
    <!-- 上传 -->
    <uploader
      ref="uploader"
      :options="options"
      :autoStart="false"
      @file-added="onFileAdded"
      @file-success="onFileSuccess"
      @file-progress="onFileProgress"
      @file-error="onFileError"
      class="uploader-app"
    >
      <uploader-unsupport></uploader-unsupport>

      <uploader-btn id="global-uploader-btn" :attrs="attrs" ref="uploadBtn"
        >选择文件</uploader-btn
      >

      <uploader-list v-show="panelShow">
        <div
          class="file-panel shadow-wrap"
          slot-scope="props"
          :class="{ collapse: collapse }"
        >
          <div class="file-title">
            <h3>文件列表</h3>
            <div class="operate">
              <el-button
                @click="fileListShow"
                type="text"
                :title="collapse ? '展开' : '折叠'"
              >
                <i
                  class="el-icon-minus color-size"
                  :class="collapse ? 'inuc-fullscreen' : 'inuc-minus-round'"
                ></i>
              </el-button>
              <el-button
                @click="close"
                type="text"
                title="关闭"
                class="btncolor"
              >
                <i class="el-icon-close color-size"></i>
              </el-button>
            </div>
          </div>

          <ul class="file-list">
            <li v-for="file in props.fileList" :key="file.id">
              <uploader-file
                :class="'file_' + file.id"
                ref="files"
                :file="file"
                :list="true"
              ></uploader-file>
            </li>
            <div class="no-file" v-if="!props.fileList.length">
              <i class="iconfont icon-empty-file"></i> 暂无待上传文件
            </div>
          </ul>
        </div>
      </uploader-list>
    </uploader>
  </div>
</template>

<script>
/**
 *   全局上传插件
 *   调用方法：this.$bus.$emit('openUploader', {}) 打开文件选择框，参数为需要传递的额外参数
 *   监听函数：this.$bus.$on('fileAdded', fn); 文件选择后的回调
 *            this.$bus.$on('fileSuccess', fn); 文件上传成功的回调
 */

import { ACCEPT_CONFIG } from "./js/config";
import SparkMD5 from "spark-md5";
import $ from "jquery";

export default {
  data() {
    return {
      options: {
        target: "/api/file/chunk/upload",
        chunkSize: "2048000",
        fileParameterName: "file",
        maxChunkRetries: 3,
        testChunks: true, //是否开启服务器分片校验
        // 服务器分片校验函数，秒传及断点续传基础
        checkChunkUploadedByResponse: function(chunk, message) {
          let result = JSON.parse(message);
          if (result.code === 0) {
            if (result.data.skipUpload) {
              return true;
            }
            let chunkNum = chunk.offset + 1;
            return (result.data.chunkList || []).indexOf("" + chunkNum) >= 0;
          }
          return false;
        },
        // headers: {
        //     Authorization: Ticket.get() && "Bearer " + Ticket.get().access_token
        // },
        query: (file, chunk) => {
          return {
            ...file.params
          };
        }
      },
      attrs: {
        accept: ACCEPT_CONFIG.getAll()
      },
      panelShow: false, //选择文件后，展示上传panel
      collapse: false,
      params: {}
    };
  },
  mounted() {
    // console.log("uploader注册进来", this.$refs);
    this.$bus.$on("openUploader", query => {
      this.params = query || {};

      if (this.$refs.uploadBtn) {
        console.log($("#global-uploader-btn"));
        $("#global-uploader-btn").click();
      }
    });
  },
  computed: {
    //Uploader实例
    uploader() {
      return this.$refs.uploader.uploader;
    }
  },
  methods: {
    onFileAdded(file) {
      this.panelShow = true;
      this.computeMD5(file);

      // 2022/1/10 将额外的参数赋值到每个文件上，解决了不同文件使用不同params的需求
      file.params = this.params;

      this.$bus.$emit("fileAdded");
    },
    // 上传进度的回调
    onFileProgress(rootFile, file, chunk) {
      // console.log(
      //   `上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${
      //     chunk.endByte / 1024 / 1024
      //   }`
      // );
    },
    onFileSuccess(rootFile, file, response, chunk) {
      console.log(response);
      let res = JSON.parse(response);

      // 服务器自定义的错误（即虽返回200，但是是错误的情况），这种错误是Uploader无法拦截的
      if (res.code === -1) {
        this.$message({ message: res.message, type: "error" });
        // 文件状态设为“失败”
        this.statusSet(file.id, "failed");
        return;
      }
      res.needMerge = false;
      // 如果服务端返回需要合并
      if (res.needMerge) {
        // 文件状态设为“合并中”
        this.statusSet(file.id, "merging");

        // api.mergeSimpleUpload({
        //     tempName: res.tempName,
        //     fileName: file.name,
        //     ...file.params,
        // }).then(res => {
        //     // 文件合并成功
        //     this.$bus.$emit('fileSuccess');
        //
        //     this.statusRemove(file.id);
        // }).catch(e => {});

        // 不需要合并
      } else {
        this.$bus.$emit("fileSuccess");
        console.log("上传成功");
      }
    },
    onFileError(rootFile, file, response, chunk) {
      this.$message({
        message: response,
        type: "error"
      });
    },

    /**
     * 计算md5，实现断点续传及秒传
     * @param file
     */
    computeMD5(file) {
      let fileReader = new FileReader();
      let time = new Date().getTime();
      let blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice;
      let currentChunk = 0;
      const chunkSize = 10 * 1024 * 1000;
      let chunks = Math.ceil(file.size / chunkSize);
      let spark = new SparkMD5.ArrayBuffer();

      // 文件状态设为"计算MD5"
      this.statusSet(file.id, "md5");
      file.pause();

      loadNext();

      fileReader.onload = e => {
        spark.append(e.target.result);

        if (currentChunk < chunks) {
          currentChunk++;
          loadNext();

          // 实时展示MD5的计算进度
          this.$nextTick(() => {
            $(`.myStatus_${file.id}`).text(
              "校验MD5 " + ((currentChunk / chunks) * 100).toFixed(0) + "%"
            );
          });
        } else {
          let md5 = spark.end();
          this.computeMD5Success(md5, file);
          console.log(
            `MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${
              file.size
            } 用时：${new Date().getTime() - time} ms`
          );
        }
      };

      fileReader.onerror = function() {
        this.error(`文件${file.name}读取出错，请检查该文件`);
        file.cancel();
      };

      function loadNext() {
        let start = currentChunk * chunkSize;
        let end =
          start + chunkSize >= file.size ? file.size : start + chunkSize;

        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
      }
    },

    computeMD5Success(md5, file) {
      file.uniqueIdentifier = md5;
      file.resume();
      this.statusRemove(file.id);
    },

    fileListShow() {
      let $list = $("#global-uploader .file-list");

      if ($list.is(":visible")) {
        $list.slideUp();
        this.collapse = true;
      } else {
        $list.slideDown();
        this.collapse = false;
      }
    },
    close() {
      this.uploader.cancel();

      this.panelShow = false;
    },

    /**
     * 新增的自定义的状态: 'md5'、'transcoding'、'failed'
     * @param id
     * @param status
     */
    statusSet(id, status) {
      let statusMap = {
        md5: {
          text: "校验MD5",
          bgc: "#fff"
        },
        merging: {
          text: "合并中",
          bgc: "#e2eeff"
        },
        transcoding: {
          text: "转码中",
          bgc: "#e2eeff"
        },
        failed: {
          text: "上传失败",
          bgc: "#e2eeff"
        }
      };

      this.$nextTick(() => {
        $(`<p class="myStatus_${id}"></p>`)
          .appendTo(`.file_${id} .uploader-file-status`)
          .css({
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            zIndex: "1",
            backgroundColor: statusMap[status].bgc
          })
          .text(statusMap[status].text);
      });
    },
    statusRemove(id) {
      this.$nextTick(() => {
        $(`.myStatus_${id}`).remove();
      });
    },

    error(msg) {
      this.$notify({
        title: "错误",
        message: msg,
        type: "error",
        duration: 2000
      });
    }
  },
  watch: {},
  destroyed() {
    this.$bus.$off("openUploader");
  },
  components: {}
};
</script>

<style scoped lang="scss">


#global-uploader {
    position: fixed;
    right: 177px;
    bottom: 40px;
    z-index: 100;

  .uploader-app {
    width: 520px;
  }

  .file-panel {
    // right: 15px;
    // bottom: 15px;
    // background-color: #fff;
    // border: 1px solid #e2e2e2;
    border-radius: 7px 7px 0 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

    .file-title {
      display: flex;
      height: 40px;
      // line-height: 40px;
      align-items: center;
      padding: 0 15px;
      // border-bottom: 1px solid #ddd;

      .operate {
        flex: 1;
        text-align: right;
      }
    }

    .file-list {
     position: relative;
    height: 130px;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 10px 5px;
    margin: 0;

      > li {
        // background-color: #fff;
        list-style-type: none;
        padding-bottom: 5px;
      }
    }

    &.collapse {
      .file-title {
        // background-color: #e7ecf2;
      }
    }
  }

  .no-file {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
  }

  /deep/ .uploader-file-icon {
    &:before {
      content: "" !important;
    }

    &[icon="image"] {
      background: url(./images/image-icon.png);
    }
    &[icon="video"] {
      background: url(./images/video-icon.png);
    }
    &[icon="document"] {
      background: url(./images/text-icon.png);
    }
  }

  /deep/ .uploader-file-actions > span {
    margin-right: 6px;
  }
}

/* 隐藏上传按钮 */
#global-uploader-btn {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
// .title-wrap {
//   cursor: move;
// }
.el-button {
  font-size: 22px;
}

.uploader-list /deep/ .uploader-file-actions > .uploader-file-remove {
  display: block;
  float: left;
  width: 16px;
  height: 16px;
  margin-top: 16px;
  // margin-right: 10px;
  cursor: pointer;
}

.color-size {
  font-size: 20px;
  color: #0ff;
  font-weight: bold;
}

// 文件上传
/deep/ .uploader-file-progress {
  background: rgba(7, 55, 62,0.8);
}

/deep/ .uploader-file[status=error] .uploader-file-progress {
  background: rgba(7, 55, 62,0.8);
}

/deep/ .uploader-file {
  border-bottom: none;
}

.uploader-file-info {
  color: #fff;
}

</style>
