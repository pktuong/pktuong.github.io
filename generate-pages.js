const fs = require("fs");
const path = require("path");

const links = JSON.parse(fs.readFileSync("links.json", "utf8"));
const outDir = "dist";

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

// Báo cho GitHub Pages biết không cần xử lý qua Jekyll
fs.writeFileSync(path.join(outDir, ".nojekyll"), "");

function redirectHtml(target) {
  const safeTarget = JSON.stringify(target);
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0; url=${target}">
<script>location.replace(${safeTarget});</script>
</head>
<body>Đang chuyển hướng... <a href="${target}">Bấm vào đây nếu không tự chuyển</a></body>
</html>`;
}

let count = 0;
for (const [code, target] of Object.entries(links)) {
  if (!/^https?:\/\//i.test(target)) {
    console.warn(`Bỏ qua "${code}": URL không hợp lệ`);
    continue;
  }
  const dir = path.join(outDir, code);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), redirectHtml(target));
  count++;
}

const listHtml = Object.keys(links)
  .map((code) => `<li><a href="/${code}/">/${code}</a></li>`)
  .join("\n");

fs.writeFileSync(
  path.join(outDir, "index.html"),
  `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><title>Rút gọn link</title></head>
<body>
<h1>Danh sách link rút gọn</h1>
<p>Sửa file links.json trong repo để thêm/sửa link.</p>
<ul>${listHtml}</ul>
</body>
</html>`
);

console.log(`Đã tạo ${count} trang redirect.`);
