
import { defineStore } from "pinia";
import { type History } from "@/types/History";
import { reactive } from "vue";
export const useHistoryStore = defineStore('history',{
  actions:{
    setHistoryList(historyList:Array<History>){
      this.$state.historyList = historyList;
    },
    setHistoryListByLocal(){
      const localHistoryList = localStorage.getItem('historyList')!
      if(localHistoryList) {
        this.$state.historyList =  JSON.parse(localHistoryList);
      }
    },
     getHistoryById(id: number) {
      let history = this.historyList.find(history => history.id === id);
      if(!history) {
        history = {
          id:-1,
          content:"",
          messages:[
          ],
          createTime:-1,
          count:0,
          state:0
        }
      }
      return reactive(history);
    },
    //添加新的对话
    addHistory(history:History){
      history.content = history.messages[0].content.toString()
      history.id = Date.now();
      history.createTime = Date.now();
      history.state = 1;
      history.count = history.messages.length
      this.historyList.unshift(history);
      return this.getHistoryById(history.id);
    },

  },
  state(){
    return {
      historyList:[] as Array<History>
    }
  }

})
