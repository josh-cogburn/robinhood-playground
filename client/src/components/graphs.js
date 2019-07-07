const createDataSet = dataSetProps => ({
  lineTension: 0.1,
  backgroundColor: 'rgba(75,192,192,0.2)',
  // pointBorderColor: key === 'account balance' ? 'black' : getColor(key),
  // pointBorderWidth: 10,
  // borderColor: key === 'account balance' ? 'black' : getColor(key),
  borderCapStyle: 'butt',
  // borderWidth: key === 'account balance' ? 5 : 5,
  borderDashOffset: 0.0,
  borderJoinStyle: 'round',
  // pointBorderColor: key === 'account balance' ? 'black' : getColor(key),
  pointBackgroundColor: '#fff',
  // pointBorderWidth: key === 'account balance' ? 2 : 10,
  pointHoverRadius: 5,
  // pointHoverBackgroundColor: getColor(key),
  pointHoverBorderColor: 'black',
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10,

  ...dataSetProps
});

export default [
  {
    title: 'Current prices',
    dataProp: 'allPrices',
    dataFn: ({ allPrices }) => {
      const labels = allPrices.map(hist => (new Date(hist.timestamp).toLocaleString()));
      const data = allPrices.map(hist => hist.currentPrice);
      return {
        labels,
        datasets: [
          createDataSet({
            label: 'Current Price',
            fill: true,
            data
          })
        ]
      };
    }
  },
  {
    title: 'RSI Series',
    dataProp: 'rsiSeries',
    dataFn: ({ allPrices, rsiSeries }) => {
      const labels = allPrices.map(hist => (new Date(hist.timestamp).toLocaleString()));
      return {
        labels,
        datasets: [
          createDataSet({
            label: 'RSI',
            fill: true,
            data: rsiSeries
          })
        ]
      };
    }
  },
  {
    title: 'KST Series',
    dataProp: 'kstSeries',
    dataFn: ({ allPrices, kstSeries }) => {
      const labels = allPrices.map(hist => (new Date(hist.timestamp).toLocaleString()));
      const getDataForProp = prop => kstSeries.map(obj => obj[prop]);
      console.log(['kst', 'signal'].map(prop => ({
        prop,
        data: getDataForProp(prop)
      })));
      return {
        labels,
        datasets: [
          'kst',
          'signal'
        ].map(prop => createDataSet({
          label: prop.toUpperCase(),
          fill: false,
          borderColor: prop === 'signal' ? 'blue' : 'orange',
          data: getDataForProp(prop)
        }))
      };
    }
  }
];