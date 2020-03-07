<template>
<div id="app">
  <div class="container">
    <div class="jumbotron">
      <h1>Message Board</h1>
    </div>
    <!-- prevent 表示阻止表单提交时重载页面 -->
    <!-- keydown 绑定的事件表示表单下的某个数据框有字符输入时，清除该输入框上的errors -->
    <div class="messageForm container">
      <form action="/api/messages" method="POST" @submit.prevent="onSubmit" @keydown="form.errors.clear($event.target.name)">
        <!-- 设置 has-error 类，设置了这个类 div 里面都会显示错误的状态，如输入框会变红色，help-block 里的文字也会变红色 -->
        <!-- form-group 是必要的类，是否设置 form.error 需要看 errors 中 是否有该输入框的错误，这是 vue 类绑定语法中的一种 -->
        <div :class="['form-group', {'has-error': form.errors.has('name')}]">
          <input type="text" class="form-control" name="name" placeholder="你的名字？" v-model="form.name">
          <span class="help-block" v-if="form.errors.has('name')" v-text="form.errors.get('name')"></span>
        </div>
        <div :class="['form-group', {'has-error': form.errors.has('text')}]">
          <textarea class="form-control" name="text" rows="5" placeholder="说点什么..." v-model="form.text"></textarea>
          <span class="help-block" v-if="form.errors.has('text')" v-text="form.errors.get('text')"></span>
        </div>
        <!-- 当form.errors 中有任何一个输入框有错误时，设置Submit 按钮为 disable 状态 -->
        <button class="btn btn-default" :disabled="form.errors.any()">Submit</button>
      </form>
      <div class="messages-header">{{ messages.length }} messages</div>
      <div class="messages">
        <ul tansition="fade">
          <template v-for="message in messages">
            <message-item :message="message"></message-item>
          </template>
        </ul>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import MessageItem from './MessageItem.vue'

class Errors {
  constructor() {
    this.errors = {}
  }

  // 某个输入框数据是否有错误
  has(field) {
    return this.errors.hasOwnProperty(field)
  }

  // 任何一个输入框数据有错误返回true
  any() {
    return Object.keys(this.errors).length > 0
  }

  get(field) {
    if (this.errors[field]) {
      return this.errors[field][0]
    }
  }

  // 初始化errors
  record(errors) {
    this.errors = errors
  }

  // 清除某个输入框的错误
  clear(field) {
    delete this.errors[field]
  }
}

/**
 * 封装 Form
 */
class Form {
  constructor(data) {
    this.originalData = data

    // 为了能以form.field 的方式获取数据，如 form.name
    for (let field in data) {
      this[field] = data[field]
    }

    // 将 errors 移入 form 中，更合理
    this.errors = new Errors()
  }

  // 获取 form中的数据，返回一个新的对象
  data() {
    let data = {}

    for (let property in this.originalData) {
      data[property] = this[property]
    }

    return data
  }

  reset() {
    for (let field in this.originalData) {
      this[field] = ''
    }
    this.errors.clear()
  }

  /**
   * 封装了表单提交操作，需要传入请求的类型和路径
   * 结果返回了一个 Promise，Promise 是 ES6中新的标准,
   * 它是做什么的网上有很多文章介绍，这里就不再详述
   * 简单的说，Promise 封装了一个异步操作，接收俩个回调函数
   * resolve 和 reject，你可以理解为 resole 是在请求成功时调用，
   * reject 是在请求失败时调用
   * 在这里，异步操作就是我们发送的请求，俩个回调函数就是我们在
   * 后面 onSubmit 中定义的
   */
  submit(requestType, url) {
    return new Promise((resolve, reject) => {
      http[requestType](url, this.data())
        .then(response => {
          this.onSuccess(response.data)
          resolve(response.data)
        })
        .catch(error => {
          this.onFail(error.response.data.errors)
          reject(error.response.data)
        })
    })
  }

  onSuccess(data) {
    this.reset()
  }

  onFail(errors) {
    this.errors.record(errors)
  }

  post(url) {
    return this.submit('post', url)
  }
}

export default {
  name: 'app',
  data() {
    return {
      messages: [],
      form: new Form({
        name: '',
        text: ''
      })
    }
  },
  methods: { // 点击 Submit 会触发此事件，向服务器发送 POST 请求
    onSubmit() {
      this.form.post('/api/messages')
        .then(data => this.message.unshift(data))
        .catch(errors => {})
    }
  },
  components: {
    MessageItem
  },
  mounted() {
    http.get('/api/messages')
      .then(response => this.messages = response.data)
  }
}
</script>

<style>
.messageForm {
  width: 650px;
  margin-top: 60px;
}

#app {
  margin-top: 60px;
  margin: 0 auto;
}

.title {
  text-align: center;
  margin-bottom: 20px;
  color: #e3e3e3;
}

.messages-header {
  line-height: 1;
  color: #666;
  padding: 20px 0 6px;
  border-bottom: 1px solid #eee;
  text-transform: uppercase;
  font-size: 13px;
}

.messages ul {
  margin: 0;
  padding: 0;
}
</style>
