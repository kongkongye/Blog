---
layout: post
title:  react native
categories: js
tags:  react native
author: kongkongye
---

* content
{:toc}

react native




## 提示
* `componentDidMount`与`componentWillUnmount`会配对调用,但`componentWillMount`(将要废弃)不会,因为在componentWillMount之后渲染过程可能被中断,导致componentWillUnmount不会被调用.
* `static getDerivedStateFromProps(nextProps, prevState): newState`配合`componentDidUpdate`用来代替旧的使用`componentWillReceiveProps`的情况
* `getSnapshotBeforeUpdate(prevProps, prevState)`配合`componentDidUpdate`用来代替旧的使用`componentWillUpdate`的情况(但一般getSnapshotBeforeUpdate用的不多)
* 初始化`state`的推荐方式:

        class ExampleComponent extends React.Component {
          state = {
            currentColor: this.props.defaultColor,
            palette: 'rgb',
          };
        }

* 异步获取数据推荐的方式(放在`componentDidMount`里进行):

        class ExampleComponent extends React.Component {
          state = {
            externalData: null,
          };

          componentDidMount() {
            this._asyncRequest = asyncLoadData().then(
              externalData => {
                this._asyncRequest = null;
                this.setState({externalData});
              }
            );
          }

          componentWillUnmount() {
            if (this._asyncRequest) {
              this._asyncRequest.cancel();
            }
          }

          render() {
            if (this.state.externalData === null) {
              // Render loading state ...
            } else {
              // Render real UI ...
            }
          }
        }

* 订阅的示例:

        class ExampleComponent extends React.Component {
          state = {
            subscribedValue: this.props.dataSource.value,
          };

          componentDidMount() {
            //放在componentDidMount里,保证componentWillUnmount会被调用
            this.props.dataSource.subscribe(this.handleSubscriptionChange);

            //此时外部值可能会改变,因此这代码有时是必要的
            if (this.state.subscribedValue !== this.props.dataSource.value) {
              this.setState({
                subscribedValue: this.props.dataSource.value,
              });
            }
          }

          componentWillUnmount() {
            this.props.dataSource.unsubscribe(this.handleSubscriptionChange);
          }

          handleSubscriptionChange = dataSource => {
            this.setState({subscribedValue: dataSource.value});
          };
        }

* `componentWillUpdate`与`componentWillReceiveProps`都可能在一次update中被调用多次,因此`componentDidUpdate`更加适合,因为它在一次update中只会被调用一次.
