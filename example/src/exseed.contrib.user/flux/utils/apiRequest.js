export default function apiRequest(req) {
  $.ajax({
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
    req.fail(jqXHR.responseText);
  });
};