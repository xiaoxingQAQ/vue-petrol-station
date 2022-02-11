// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import {
  BarChart,
  LineChart,
  PieChart,
} from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent, // 标题
  TooltipComponent, // 提示框
  ToolboxComponent, 
  GridComponent, // 直角坐标系
  DatasetComponent, // 数据集
  TransformComponent, // 内置数据转换器组件
  LegendComponent,
  
} from 'echarts/components';
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  

  BarChart,
  LineChart,
  PieChart,

  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
 
]);

export default echarts