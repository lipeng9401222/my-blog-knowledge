(function () {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();

  var chart = echarts.init(document.getElementById('chart-hot'), null, { renderer: 'svg' });
  chart.setOption({
    animation: false,
    tooltip: { trigger: 'axis', appendToBody: true, axisPointer: { type: 'shadow' } },
    grid: { left: 70, right: 40, top: 20, bottom: 30 },
    xAxis: {
      type: 'value',
      axisLabel: { color: muted },
      splitLine: { lineStyle: { color: rule } }
    },
    yAxis: {
      type: 'category',
      data: ['昕玥', '奕辰', '雨桐'],
      axisLabel: { color: ink, fontSize: 13 },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false }
    },
    series: [{
      type: 'bar',
      data: [
        { value: 151, itemStyle: { color: accent2 } },
        { value: 220, itemStyle: { color: accent2 } },
        { value: 237, itemStyle: { color: accent } }
      ],
      barWidth: 26,
      label: { show: true, position: 'right', color: ink, formatter: '{c} 人' }
    }]
  });
  window.addEventListener('resize', function () { chart.resize(); });
})();
