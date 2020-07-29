/**
 * ChartService to define the chart config for D3
 */
export class D3ChartService {
  static getChartConfig(): any {
    const today = new Date();
    const priorDate = new Date().setDate(today.getDate() - 30);
    return {
      chart: {
        type: 'lineChart',
        height: 200,
        margin: {
          top: 20,
          right: 20,
          bottom: 40,
          left: 55,
        },
        x(d: { x: any }): any {
          return d.x;
        },
        y(d: { y: any }): any {
          return d.y;
        },
        useInteractiveGuideline: true,
        xAxis: {
          axisLabel: 'Dates',
          showMaxMin: false,
          tickFormat(d: Date): any {
            return d3.time.format('%b %d')(new Date(d));
          },
        },
        xDomain: [priorDate, today],
        yAxis: {
          axisLabel: '',
          axisLabelDistance: 30,
        },
      },
      title: {
        enable: true,
        text: 'Blood Pressure',
      },
    };
  }
}
