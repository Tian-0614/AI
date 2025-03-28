<template>
    <div class="t-ai-xiaoxin t-ai-markdown" >
        <!-- 正体 -->
        <div class="t-ai-body">

            <div class="t-ai-body-content" v-if="dialogueList.length > 0 || loading">
                
                <el-scrollbar height="100%"  ref="scrollbarRef" width="100%" style="width: 100%;">
                    <div class="t-ai-dialgue" >
                        <div style="height:10px;"></div>
                        <template v-for="(item,index) in dialogueList" :key="item">
                            <div class="t-ai-ai-dialogue" v-if="item.message.role == 'assistant'" >
                                <div v-if="getThanks(item.message.content)" class="t-ai-think" style="margin-top: 10px;" @click="item.isOpenThink = !item.isOpenThink">
                                    <span>深度思考</span>
                                    <el-icon style="margin-left: 10px;"> 
                                        <ArrowDownBold v-if="!item.isOpenThink" />
                                        <ArrowRightBold v-else />
                                    </el-icon>
                                </div>
                                <div v-if="getThanks(item.message.content)" class="t-ai-think-content" :style="{height:!item.isOpenThink ? 'auto':'0px',padding:!item.isOpenThink ? '10px':'0px'}"> 
                                    <div v-html="getThanks(item.message.content)"></div>
                                </div>
                                <div class="t-ai-ai-message">
                                    <div v-html="render(item.message)"></div>
                                </div>
                                <div class="t-ai-receive_message" v-if="index == dialogueList.length-1" >
                                    <template v-for="item in receiveMessageList" :key="item">
                                        <div class="t-ai-receive_message-item" @click="question = item;submit();">
                                            {{ item  }}
                                            <img src="@/images/right.png" style="width: 35px;margin-left: 10px;" alt="">
                                        </div>
                                    </template>
                                </div>
                            </div>
                            <div class="t-ai-user-dialogue" v-else-if="item.message.role == 'user'">
                                <div class="t-ai-user-message">
                                    <div v-html="md.render(item.message.content)"></div>
                                </div>
                            </div>
                        </template>
                        <div class="t-ai-ai-dialogue" v-if="loading">
                            <div v-if="getThanks(currentMessage)" class="t-ai-think-content" :style="{height:!isOpenThink ? 'auto':'0px',padding:!isOpenThink ? '10px':'0px'}"> 
                                    <div v-html="getThanks(currentMessage)"></div>
                                </div>
                            <div class="t-ai-ai-message">
                                <div v-html="render2(currentMessage)"></div>
                            </div>
                            <div style="display: flex;align-items: center;margin-top: 10px; ">
                                <el-icon type="primary" color="var(--t-ai-primary-color)" class="t-ai-loading">
                                    <Loading />
                                </el-icon>
                                思考中...
                            </div>
                            
                        </div>
                    </div>
                </el-scrollbar>
                <!-- <div v-if="setLow" @click="setLowClick" class="t-ai-set-low" >
                    <el-icon><ArrowDownBold /></el-icon>
                </div> -->
            </div>
        </div>
    </div>
</template>
<script>

import { ArrowDownBold,ArrowRight,ArrowDown,ArrowRightBold,Loading } from '@element-plus/icons-vue';
import { ElIcon,ElScrollbar, } from 'element-plus';
// 导入ElIcon ElScrollbar样式
import 'element-plus/es/components/scrollbar/style/css';

import 'highlight.js/styles/foundation.css';
// 通常的默认值们
import MarkdownIt from 'markdown-it';
import markdownItHighlightjs from 'markdown-it-highlightjs'; // 代码高亮插件
import markdownItMultimdTable from 'markdown-it-multimd-table';
export default {
    name: 'markdown',
    components: {
        ArrowDownBold,ArrowDown,ArrowRightBold,ElIcon,ElScrollbar,Loading
    },
    props: {
        // 页面加载完毕
        onload: {
            type: Function,
            default: () => {
                return () => {}
            }
        },
        // 模式 弹窗模式 还是 页面模式 dialog | page
        model: {
            type: String,
            default: 'page'
        },
        container: {
            type: [Object, String,Number,Boolean,Array,Function,Symbol,],
        }
    },
    watch: { 
        model(val){
            this.type = val;   
        }
    },
    emits: ['onload'],
    data() {
        const md = new MarkdownIt();
            md.use(markdownItHighlightjs);
            md.use(markdownItMultimdTable,{
            multiline:  true,
            rowspan:    true,
            headerless: true,
            multibody:  true,
            autolabel:  true,
        });
        return {
            md,
            type: 'page',
            mentionList:[],
            currentMessage: '',
            active: '',
            isOpenThink: false,
            // 当前对话
            current: {},
            question:'',
            dialogueList:[],
            // 置底按钮
            setLow: false,
            timer: null,
            loading:false,
            think: '',

        }
    },
    created(){
        this.type = this.model;
    },
    methods: {
        render2(item){
            this.think = this.getThanks(item);
            let str = '';
            // 先找到第一个<think>标签
            const start = item.indexOf('<think>');
            if(start == -1){
                str = item;
            }else{
                const end = item.indexOf('</think>');
                if(end == -1){
                    str = '';
                }else{
                    str = item.substring(end + 9,item.length);
                }
            }
            return this.md.render(str)
        },
        // 解析thanks标签
        render(item){
            let str = ''
            if(typeof item == 'string'){
                this.think = this.getThanks(item);
                console.log(this.think)
                // str = item.replace(this.think,'')
                return this.md.render(item)
            }else{
               
                item.think = this.getThanks(item.content);
                str = item.content.replace(this.think,'')
                // 先找到第一个<think>标签
                const start = item.content.indexOf('<think>');
                if(start == -1){
                    str = item.content;
                }else{
                    const end = item.content.indexOf('</think>');
                    if(end == -1){
                        str = '';
                    }else{
                        str = item.content.substring(end + 9,item.content.length);
                    }
                }
                return this.md.render(str)
                // return item.think
            }
            
        },
        getThanks(item){
            let str = '';
            // 先找到第一个<think>标签
            const start = item.indexOf('<think>');
            if(start == -1){
                str =  ''
            }else{
                const end = item.indexOf('</think>');
                if(end == -1){
                    str = item 
                }else{
                    str = item.substring(start + 7,end)
                }
            }
            str =  str.replace(/\n/g, '<br />');
            return str.replace(/\n/g, `<span style="margin:0 20px;" ><span/>`);
        },
        // 添加一条ai回答断句
        addOnceShortMessage(item){
            this.loading = true;
            if(!item.done){
                this.currentMessage += item.message;
            }else{
                if(!this.currentMessage){
                    this.currentMessage =  '服务器繁忙，请稍后重试！'
                }
                this.dialogueList.push({
                    message: {
                        role: 'assistant',
                        content: this.currentMessage
                    }, 
                })
                this.loading = false;
            }
           
        },
   
        resetDialogueList(list){
            this.dialogueList.length = 0;
            list.forEach(element => {
                this.dialogueList.push(element)
            });
        },
        // 添加一条ai回答
        addOnceDialogue(item){
            this.dialogueList.push(item);
            this.question = '';
        },
    },
    mounted() {
        if(this.onload)this.onload();
    }

}
</script>
<style scoped lang="scss">

.t-ai-xiaoxin {
    height: 100%;
    width: 100%;
    display: flex;
    font-size: 16px;
    font-family: Inter,-apple-system,BlinkMacSystemFont,Segoe UI,SF Pro SC,SF Pro Display,SF Pro Icons,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;
}

.t-ai-body{
    flex-grow: 1;
    height: 100%;
    flex-shrink: 1;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-direction: column;
    .t-ai-body-content{
        width: 100%;
        flex-grow: 1;
        height: 200px;
        flex-shrink: 1;
        display: flex;
        justify-content: center;
        box-sizing: border-box;
        position: relative;
        .t-ai-set-low{
            position: absolute;
            bottom: 30px;
            left: calc(50%  - 20px);
            width: 40px;
            height: 40px;
            background-color: #fff;
            color: var(--t-ai-primary-color);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--t-ai-line-color);
            box-shadow: var(--el-box-shadow-lighter);
            cursor: pointer;
            &:hover{
                background-color: var(--t-ai-primary-color);
                color: #fff;
            }

        }
       
        .t-ai-dialgue{
            width: 100%;
            display: flex;
            flex-direction: column;
            .t-ai-ai-dialogue{
                align-self: flex-start;
                margin-bottom: 30px;
                display: flex;
                flex-direction: column;
                position: relative;
                margin: 0 30px;
                width: calc(100% - 60px);
                padding-top: 0px;
                .t-ai-ai-message{
                    padding: 8px 16px;
                    border-radius: 20px;
                }
            }
            .t-ai-user-dialogue{
                align-self: flex-end;
                margin-bottom: 30px;
                position: relative;
                margin: 0 60px;
                .t-ai-user-dialogue-logo{
                    height: 40px;
                    border-radius: 50%;
                    position: absolute;
                    right: -50px;
                    top: 0px;
                }
                .t-ai-user-message{
                    padding: 1px 16px;
                    background-color: #DEE7FB;
                    border-radius: 20px;
                }
                .t-ai-user-other{
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    margin-top: 5px;
                    font-size: 12px;
                    color: var(--t-ai-text-color);
                    font-size: 14px;
                    font-weight: 600;
                }
                
            }
        }
    }
   
}


</style>
<style lang="scss">
@use '@/style.scss'; 
// 创建一个加载动画
@keyframes loading {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.t-ai-loading{
    font-size: 20px;
    color:var(--t-ai-primary-color);
    animation: loading 1s infinite linear;
    margin-right: 10px
}
</style>