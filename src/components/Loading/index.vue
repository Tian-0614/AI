<template>
    <div class="t-loading">
        加载中...
    </div>
</template>
<script>
export default {
    name: 'TLoading',
    props: {
        color: {
            type: String,
            default: '#007bff'
        },
        size: {
            type: Number,
            default: 16
        },
        type: {
            type: String,
            default: 'circle'
        }
    },
    data() {
        return {
            loading: true
        } 
    },
    methods: {
        createLoading() {
           this.loading = true;
        }
    }
}
</script>
<style >
.t-loading {
   position: fixed;
   top: 0;
   left: 0;
   width: 200px;
   height: 200px;
   background-color: rgba(0, 0, 0, 0.5); 
   color: #fff;
   display: flex;
   align-items: center;
   justify-content: center;
}
</style>