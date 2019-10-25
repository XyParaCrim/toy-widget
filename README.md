# Toy-Widget

## 特性
一套用于构建各式各样图形编辑器的基本框架。

- [anrajs](https://github.com/anrainie/anrajs/tree/master/modules/aditor-svg) - toy-widget + svg流程图编辑器，提供拖、连线、快捷键、事件处理、图形绘制、选择监听等一系列编辑器功能。

### 灵活的特性
程序是由一个个部件(Widget)对象组合而成，而部件的特性(feature)完全可以根据开发者想法自己定制。当然，内置了一些流程图的相关特性：

- 组件化(composable)
- 响应式(reactive)
- 事件机制(emitter)
- 命令模式(commander)
- 选择监听(selection)
- 策略模式(policy)
- 工具模式(tool)
- 虚拟事件(tracker)
- 虚拟节点结构(children)
- 数据绑定(model)
- 。。。

以上内置部件特性也完全是热插拔的。

### 完全配置化
- 部件配置化：每个部件的实现都是以完全配置化为目标，即必须通过配置选项(options)实例化
- 特性配置化：配置新的特性，产生新的编辑器框架

### 生命周期模板



## 安装

```bash
npm install anrajs
```

### 简单使用

定义一个名叫Node的新部件，并添加默认选项name；然后为Node添加支持name和size选项的特性

```js
import ToyWidget from 'toy-widget'

ToyWidget.Widget.define('Node', { name: 'good-node' })
ToyWidget.Widget.feature('Node', {
  // 定义支持的选项
  options: {
    name: {
      merge: 'replay', // name选项是如何合并的
      build(nodeWidget, option) {
        nodeWidget.name = option
      }  
    },
    size: {
      build(nodeWidget, option) {
        nodeWidget.size = option
      } 
    } 
  },

  defaults: {
    size: 16, // 定义选项size的默认值

    // on选项是由emitter特性支持，提供简单的事件机制
    on: {
      create() {
        this.emit('customEvent')
      },
      customEvent() {
        console.log(this.getNameAndSize())
      }
    } 
  },

  // 给该部件添加一些方法
  mixin: {
    getNameAndSize() {
      return this.name + "-" + this.size
    }
  }
})
```
创建不同的Node部件
```js
let defaultNode = ToyWidget.Widget.of('Node')
defaultNode.getNameAndSize() //"good-node-16"

let badNode = ToyWidget.Widget.of('Node', {name: 'bad-node', size: '17'})
badNode.getNameAndSize() // "bad-node-17"
```
