import http from "k6/http";
import { check } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

const product = JSON.parse(open("product.json"));

export const options = {
  scenarios: {
    integrity: {
      executor: "constant-vus",
      vus: 5,
      duration: "10s",
    },
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/api/items/${product.id}`);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "stock is non-negative": (r) => {
      if (r.status !== 200) return false;
      try {
        const body = JSON.parse(r.body);
        return typeof body.quantity === "number" && body.quantity >= 0;
      } catch {
        return false;
      }
    },
  });
}
