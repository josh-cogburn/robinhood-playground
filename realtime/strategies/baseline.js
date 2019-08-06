let i = 0;

module.exports = {
  
  period: [30],
  handler: () => {
    i++;
    const isIncremental = Boolean(++i % 500 === 0);
    const isRandom = Boolean(Math.random() > 0.99);
    return {
      keys: {
        isIncremental,
        isRandom
      }
    };

  }
}