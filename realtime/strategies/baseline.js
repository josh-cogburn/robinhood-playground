let i = 0;

module.exports = {
  
  period: [30],
  handler: () => {
    i++;
    console.log('baseline', i);
    const isIncremental = Boolean(i % 200 === 0);
    const isRandom = Boolean(Math.random() > 0.90);
    return {
      keys: {
        isIncremental,
        isRandom
      }
    };

  }
}