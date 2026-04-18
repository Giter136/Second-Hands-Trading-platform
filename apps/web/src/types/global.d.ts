// 解决编辑器对于引入 CSS 文件的警告类型报错
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
