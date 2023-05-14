<template>
  <div>
    <el-form v-bind="$attrs"
             :validate-on-rule-change="false"
             :model="model"
             :rules="rules">
      <div v-for="formItem in formOptions"
           :key="formItem.type">

        <!-- 普通表单封装 输入框/日期组件等组件-->
        <div v-if="formItem.type === 'normalForm'">
          <div v-for="(item, index) in formItem.options"
               :key="index">
            <el-form-item :label="item.label"
                          :prop="item.prop">
              <component :is="`el-${item.type}`"
                         v-bind="item.attrs"
                         v-model="values[item?.prop]">
              </component>
            </el-form-item>
          </div>
        </div>
        <!--  嵌套表单封装 下拉框等组件-->
        <div v-else-if="formItem.type === 'nestForm'">
          <div v-for="(item, index) in formItem.options"
               :key="index">
            <el-form-item v-if="item.children && item.children.length"
                          :label="item.label"
                          :prop="item.prop">
              <component :is="`el-${item.type}`"
                         v-bind="item.attrs"
                         v-model="values[item?.prop]">
                <component :is="`el-${child.type}`"
                           v-for="(child, i) in item.children"
                           :key="i"
                           :label="child.label"
                           :value="child.value">
                </component>
              </component>
            </el-form-item>
          </div>
        </div>
        <!-- 多行布局表单封装 -->
        <div v-if="formItem.type === 'rowForm'">
          <el-row :gutter="formItem.rowGutter">
            <el-col v-for="(jtem, jndex) in formItem.cols"
                    v-bind="jtem.colOption"
                    :key="jndex">
              <el-form-item :label="jtem.label"
                            :prop="jtem.prop">
                <component :is="`el-${jtem.type}`"
                           v-bind="jtem.attrs"
                           v-model="values[jtem?.prop]">
                  <template v-if="jtem.children && jtem.children.length">
                    <component :is="`el-${child.type}`"
                               v-for="(child, i) in jtem.children"
                               :key="i"
                               :label="child.label"
                               :value="child.value">
                    </component>
                  </template>
                </component>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 上传表单组件封装 -->
        <div v-else-if="formItem.type === 'uploadForm'">
          <el-form-item :label="item.label"
                        :prop="formItem.prop">
            <el-upload v-if="item.type === 'upload'"
                       v-bind="item.uploadAttrs"
                       :on-preview="onPreview"
                       :on-remove="onRemove"
                       :on-success="onSuccess"
                       :on-error="onError"
                       :on-progress="onProgress"
                       :on-change="onChange"
                       :before-upload="beforeUpload"
                       :before-remove="beforeRemove"
                       :http-request="httpRequest">
              <slot name="uploadArea"></slot>
              <slot name="uploadTip"></slot>
            </el-upload>
          </el-form-item>
        </div>

        <!-- 提交按钮 -->
        <el-form-item>
          <slot name="action"
                :model="model"></slot>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'BaseCustomForm',
  props: {
    model: {
      type: Object,
      default: () => { }
    },
    rules: {
      type: Object,
      default: () => { }
    },
    formOptions: {
      type: Array,
      required: true,
      default: () => { }
    },
  },
  data() {
    return {
    }
  },
  computed: {
    values() {
      return this.model || {}
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
