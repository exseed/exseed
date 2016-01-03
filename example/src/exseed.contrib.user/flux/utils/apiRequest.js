export default function apiRequest(req) {
  if (process.env.BROWSER) {
    return $.ajax({
      method: req.method,
      url: req.url,
      data: req.data,
    })
    .done(res => {
      if (res.errors.length === 0) {
        req.succ(res);
      } else {
        req.fail(res);
      }
    })
    .fail(jqXHR => {
      req.fail(jqXHR.responseJSON);
    });
  } else {
    return null;
  }
};