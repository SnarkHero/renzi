// 所有的自定时事件都会保存在这里面

export const imagerror = {
  inserted (dom, options) {
    // options是指令中的变量的解释 其中有一个属性叫做value
    // dom是当前指令的dom对象
    // 当img加载失败 会报错触发一个事件onerror
    dom.src = dom.src || options.value
    dom.onerror = function () {
      // dom注册error事件
      dom.src = options.value // 不能写死
    }
  },
  componentUpdated (dom, options) {
    // componentUpdated指的是组件修改后
    dom.src = dom.src || options.value
  }
}
