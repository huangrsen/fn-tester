import { dailyFn } from "../index.js";
import { expect } from "chai";
import cases from "./case.js";

const len = cases.length;
describe(`共计进行${len}次测试`, function () {
  if (!len) {
    describe("暂未设置用例，请先设置后测试", () => {
      it("任务结束");
    });
    return;
  }
  for (let i = 0; i < len; i++) {
    describe(`第${i + 1}次测试：`, function () {
      describe(`用例：${cases[i].input}`, function () {
        const ans = dailyFn(...cases[i].input);
        it(`预期结果:${cases[i].output}，实际结果 ${ans}`, function () {
          expect(ans).to.be.deep.equal(cases[i].output);
        });
      });
    });
  }
});
