---
layout: element
title: upload自定义文件上传
date: 2023-06-06 21:35:17
tags: ["实战", "element"]
---

## 1、组件封装

```html
// 组件封装
<template>
	<div>
		<!--本地导入弹窗-->
		<div v-show="showLocalImport">
			<el-dialog title="数据导入" :visible.sync="showLocalImport" class="localImportModal">
				<div class="requirement">
					<h3>导入要求</h3>
					<slot></slot>
					<h3>模板表头(点击预览)</h3>
					<el-image style="width: 100%; height: 100px" :src="url" :preview-src-list="srcList"> </el-image>
				</div>
				<div class="btnGroup">
					<el-button class="btnContainer" type="success">
						<el-upload class="btn" action="" :http-request="uploadSectionFile" accept=".xlsx" :show-file-list="false">
							选择导入
						</el-upload>
					</el-button>
					<el-button type="primary" @click="cancel">取消 </el-button>
				</div>
			</el-dialog>
		</div>
		<!--导入进度查询-->
		<div class="MaskContainer" v-if="showProgressMask">
			<div class="Mask">
				<el-progress type="circle" :percentage="percentage" class="Mask_progress"></el-progress>
			</div>
		</div>
	</div>
</template>

<script>
	import { uploadFile_1 } from "@/utils/uploadFile";
	// import {ImportProgressQuery} from "@/utils/functionList";
	import { getProcess } from "@/utils/function";

	export default {
		name: "ImportManifestIndex_id",
		props: {
			showLocalImport: {
				type: Boolean,
				default: false,
			},
			url: {
				type: String,
				default: "",
			},
			srcList: {
				type: Array,
				default: [],
			},
			type: {
				type: Number,
				default: "",
			},
			uploadURL: {
				type: String,
				default: "",
			},
			projectId: {
				type: String,
				default: "",
			},
		},
		data() {
			return {
				percentage: 0,
				showProgressMask: false,
			};
		},
		methods: {
      // 自定义上传方法
			uploadSectionFile(content) {
				let that = this;
				const loading = this.$loading({
					lock: true,
					text: "文件上传中",
					spinner: "el-icon-loading",
					background: "rgba(0, 0, 0, 0.7)",
				});
				uploadFile_1(content, this.uploadURL, this.projectId)
					.then((res) => {
						console.log(res);
						loading.close();
						if (res.transactionId) {
							loading.close();
							this.cancel();
							this.showProgressMask = true;
							let a = setInterval(() => {
								getProcess("/import/progress", {
									data: {
										transactionId: res.transactionId,
										type: this.type,
									},
								})
									.then((data_) => {
										console.log(data_);
										if (data_.status == 0) {
											this.percentage = Number.parseFloat(((data_.complete / data_.total) * 100).toFixed(2));
											console.log(this.percentage, "this.percentage");
											if (this.percentage >= 100) {
												console.log("完毕");
												clearInterval(a);
												this.$message.success("导入成功");
												that.$bus.$emit("ImportSuccessful");
												this.showProgressMask = false;
											}
										} else if (data_.status == 1 && data_.complete == data_.total) {
											this.percentage = 100;
											this.$message.success("导入成功");
											that.$bus.$emit("ImportSuccessful");
											this.showProgressMask = false;
											clearInterval(a);
										} else {
											this.$message.error("导入失败");
											this.showProgressMask = false;
											that.$bus.$emit("ImportSuccessful");
											clearInterval(a);
										}
									})
									.catch((err_) => {
										console.log(err_);
									});
							}, 1000);
						}
					})
					.catch((err) => {
						console.log(err);
						loading.close();
					});
			},
			cancel() {
				// console.log(this.type)
				this.$emit("update:show-local-import", false);
			},
		},
		watch: {
			showProgressMask() {
				if (!this.showProgressMask) {
					this.percentage = 0;
				}
			},
		},
	};
</script>
<style scoped>
	.MaskContainer {
		width: 100vw;
		height: 100vh;
		position: fixed;
		z-index: 1000;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
<style>
	.aui-wrapper .el-upload--text {
		margin: 0 !important;
	}
</style>
```

## 2、组件使用

```html
<ImportManifestIndex_id
	:show-local-import.sync="showLocalImport"
	:url="url"
	:src-list="[url]"
	:type="14"
	:upload-u-r-l="uploadUrl"
	:project-id="projectId">
	<div>1.文件为excel xlsx 文件</div>
	<div>2.清单列表默认在第一个sheet页 或者清单sheet名称为“功能清单” 否则不可识别</div>
	<div>3.清单列表头最多为2层，其中功能lv1, lv2, lv3 和功能类编号 不可缺失</div>
	<div>4.功能类编号 列数据要唯一 有序 并按照升序排列</div>
	<div>5.功能lv1, lv2, lv3 数据列每行只可以1项有数据</div>
	<div>6.每一个功能的父级都可以追溯到1级功能</div>
	<div>7.在同一个lv1 下， 功能名称不可重复</div>
</ImportManifestIndex_id>
```

## 3、上传方法

```javascript
// 上传方法
function uploadFile_1(file, url_, projectId) {
	return new Promise((resolve, reject) => {
		let uploadData = new FormData();
		// let params = {}
		// 后端接口要求传输的参数是file和项目id，用FormData进行添加
		uploadData.append("file", file.file);
		uploadData.append("vehicleProjectId", projectId); //如果不需要项目id，则这行可以注释
		let headers = {
			"Content-Type": "multipart/form-data",
			"Accept-Language": Cookies.get("language") || "zh-CN",
			token: Cookies.get("tenant_token") || this.$store.state.user.token,
			tenant_code: Cookies.get("tenant_code") || "",
			userId: Cookies.get("userId") || null,
			deptId: Cookies.get("deptId") || null,
			appId: window.SITE_CONFIG["sysId"],
		};
		console.log(headers, "headers");
		let url = `${window.SITE_CONFIG["apiURL"]}${url_}`;
		console.log(process.env.VUE_APP_NODE_ENV, "process.env.VUE_APP_NODE_ENV");
		console.log(url, "url");
		// params = {
		//   file: uploadData,
		//   vehicleProjectId: projectId
		// }
		axios
			.post(`${url}`, uploadData, { headers: headers })
			.then((res) => {
				console.log(res, "选择导入");
				if (res.data.code == "0000") {
					resolve(res.data.data);
				} else {
					reject(res.data.message);
				}
			})
			.catch((err) => {
				console.log(err, "选择导入");
				reject("导入失败");
			});
	});
}
```
