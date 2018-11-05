<template>
  <div class="container-fluid">
    <!-- #### Desktop用 #### -->
    <div class="desktop table-row header">
      <b-row>
        <label class="title" >メンバ一覧 </label>
      </b-row>
      <b-row class='query-box'>
        <b-col cols="2">
          <form id="search">
            <input name="query" class="filter" v-model="searchQuery" placeholder="フィルタ文字列">
          </form>
        </b-col>
        <b-col cols="10">
        </b-col>
      </b-row>
      <div class="wrapper attributes header">
        <div v-for="(val, idx) in columns" v-bind:key=idx @click="sortBy(val)" :class="[{ active: sortKey === val }, val]">
          {{ val }}
          <span class="arrow" :class="sortOrders[val] > 0 ? 'asc' : 'dsc'"></span>
        </div>
      </div>
    </div>
    <!-- #### tablet用 #### -->
    <div class="tablet">
      <b-container class="table-row header">
        <b-row>
          <label class="title" >メンバ一覧 </label>
        </b-row>
        <b-row>
          <b-col cols="4">
            <input name="query" class="filter" v-model="searchQuery" placeholder="フィルタ文字列">
          </b-col>
          <b-col cols="4">
            <b-dropdown id="ddown-buttons" split right variant="success" size="sm" class="sorter">
              <template slot="button-content">
                {{sortKey}}
                <span class="arrow" :class="sortOrders[sortKey] > 0 ? 'asc' : 'dsc'"></span>
              </template>
              <b-dropdown-item v-for="(val, idx) in columns" v-bind:key=idx @click="sortBy(val)" :class="[{ active: sortKey == val }, { focus: sortKey == val }]">
                {{ val }}
              </b-dropdown-item>
            </b-dropdown>
          </b-col>
        </b-row>
      </b-container>
    </div>

    <div class="data-field">
      <div v-for="(entry,idx) in members" v-bind:key=idx @click="edit(entry.id)">
        <div class="table-row data" v-bind:style="[selectedId===entry.id ? styleForSelectedRow : styleForNonSelectedRow]">
          <div class="wrapper attributes data">
            <div v-for="(val, idx) in columns" v-bind:key=idx :class="[val]">
              <span>
                {{entry[val]}}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import Member from '../models/Member'
import SortOrders from '../models/SortOrders'

@Component
export default class ResponsiveScrollableGrid extends Vue {
  name: string = 'ResponsiveScrollableGrid';
  userName: string = 'admin';
  searchQuery: string = '';
  sortKey: string = 'キー';
  memberList: Member[] = [];
  columns: string[] = ['id', 'name', 'address'];
  sortOrders: SortOrders = new SortOrders();
  selectedId: number = -1;
  styleForSelectedRow: object = {'background-color': '#C0C0C0'};
  styleForNonSelectedRow: object = {'background-color': '#FFFFFF'};

  get members(): object[] {
    console.log('members');
    let ret = this.memberList;
    const filterKey = this.searchQuery && this.searchQuery.toLowerCase();
    if (filterKey) {
      // console.log('filterData by filterKey changed');
      ret = ret.filter((row) => {
        return Object.keys(row).some((key) => {
          return String((row as any)[key]).toLowerCase().indexOf(filterKey) > -1;
        });
      });
    }
    const sortKey = this.sortKey;
    const order = (this.sortOrders as any)[sortKey] || -1;
    console.log('sortKey : ' + sortKey + ', order : ' + order);
    if (sortKey) {
      // console.log('filterData by sortKey changed');
      ret = ret.slice().sort((a, b) => {
        a = (a as any)[sortKey];
        b = (b as any)[sortKey];
        return (a === b ? 0 : a > b ? 1 : -1) * order;
      });
    }
    console.log(ret);
    return ret;
  }

  created(): void {
    console.log('created');
    this.memberList = [
      { id: 1, name: 'aaaa', address: 'aaaa@shikataramuno.com'},
      { id: 2, name: 'bbbb', address: 'bbbb@shikataramuno.com'},
      { id: 3, name: 'cccc', address: 'cccc@shikataramuno.com'},
      { id: 4, name: 'dddd', address: 'dddd@shikataramuno.com'},
    ];
    this.columns.forEach((key) => {
      (this.sortOrders as any)[key] = 1;
    });
  }
  mounted(): void {
    console.log('mounted');
  }

  sortBy(key: string): void {
    console.log('sortBy : ' + key);
    this.sortKey = key;
    const sortOrders = Object.assign({}, this.sortOrders);
    (sortOrders as any)[key] = (sortOrders as any)[key] * -1;
    this.sortOrders = sortOrders;
  }
  edit(id: number): void {
    this.selectedId = id;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container-fluid{
    padding: 5px;
    width: 100%;
  }
  .wrapper {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    -webkit-flex-direction: row;
  }
  /* growable wrappers */
  .attributes {
    flex-grow: 0;
    -webkit-flex-grow: 0;
  }
  .row {
    margin-left: 0px;
  }
  .table-row {
    border-bottom: 1px solid #e0e0e0;
    border-collapse: collapse;
    margin-left: 0px;
    margin-right: auto;
  }
  .table-row.header {
    background-color: rgb(229, 255, 219);
    font-weight: bold;
    padding-top: 6px;
    padding-bottom: 6px;
    padding-left: 4px;
  }
  .wrapper.attributes.header {
    height: 20px;
  }
  .filter {
    width: 100%;
  }
  .query-box {
    margin-bottom: 1em
  }
  .data-field {
    height: 600px;
    overflow-y: auto;
  }
  .table-row.data {
    height: auto;
    width: 100%;
    padding-left: 6px;
    padding-right: 6px;
  }
  .wrapper.attributes.data {
    height: auto;
    margin-left: 0px;
    margin-right: 0px;
    padding-top: 6px;
  }
  .id {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
  .name {
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
  .address {
    width: 300px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }

  .desktop {
    font-size: 80%;
    font-weight: bold;
    display: block;
  }
  .tablet {
    font-size: 80%;
    font-weight: bold;
    display: none;
  }

  /*
   * Media queries: optimize for different screen widths.
   */
  @media screen and (max-device-width: 768px),screen and (max-width: 768px)
  {
    .container {
      padding-left: 4px;
    }
    .wrapper.attributes.header {
      height: auto;
    }
    .wrapper.attributes.data {
      height: auto;
    }
    .desktop {
      font-size: 80%;
      font-weight: bold;
      display: none;
    }
    .tablet {
      font-size: 80%;
      font-weight: bold;
      display: inline;
    }
    .title {
      font-size: small;
      color:  rgb(26, 92, 0);
      margin-left: 1em;
    }
    .sorter {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
      -webkit-transform: translateY(-50%) translateX(-50%);
      /* float: right; */
    }
    .dropdown .dropdown-menu .dropdown-item:focus {
      outline: none;
      /*
      background-color: #eaeaea;
      color: #1d1e1f;
      */
    }
    .data-field {
      height: 600px;
      overflow-y: auto;
    }
    .filter {
      width: 100%;
      font-size: 16px;
      /* transform: scale(0.8); */
    }
    .attributes {
      flex-direction: column;
      -webkit-flex-direction: column;
    }
    .attributes div {
      flex-grow: 0;
      -webkit-flex-grow: 0;
    }
    .attributes > div {
      width: 100%;
    }
  }
  /*
   * General good-look styles
   */
  div.active {
    color: rgb(55, 11, 177);
  }
  .arrow {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    opacity: 0.0;
  }
  .arrow.asc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid #000;
  }
  .arrow.dsc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid #000;
  }
  .sorter .arrow {
    opacity: 1;
  }
  div.active .arrow {
    opacity: 1;
  }
  div.active .arrow.asc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid rgb(55, 11, 177);
  }
  div.active .arrow.dsc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid rgb(55, 11, 177);
  }
  </style>
