const escapeXpathString = str => {
  const splitedQuotes = str.replace(/'/g, `', "'", '`);
  return `concat('${splitedQuotes}', '')`;
};

exports.clickByText = async (page, text) => {
  const escapedText = escapeXpathString(text);
  const linkHandlers = await page.$x(`//a[contains(text(), ${escapedText})]`);

  if (linkHandlers.length > 0) {
    await linkHandlers[0].click();
  } else {
    throw new Error(`Link not found: ${text}`);
  }
};

exports.screenshot = function(page, filename) {
  return page.screenshot({path: filename})
}

exports.getAllEnterLotteryLinks = async (page) => {
  const hrefs = await page.$$eval('a', as => as.map(a => a.href));
  console.log(hrefs)
}