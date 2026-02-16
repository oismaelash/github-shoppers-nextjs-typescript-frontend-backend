import http from "k6/http";
import { check } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

const sessions = JSON.parse(open("sessions.json"));
const product = JSON.parse(open("product.json"));

export const options = {
  scenarios: {
    purchase: {
      executor: "constant-vus",
      vus: 100,
      duration: "10s",
    },
  },
};

export default function () {
  const session = sessions[__VU % sessions.length];
  const cookie = `next-auth.session-token=${session.sessionToken}`;

  const res = http.post(
    `${BASE_URL}/api/purchases`,
    JSON.stringify({ itemId: product.id }),
    {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
    }
  );

  const success = check(res, {
    "status is 201 or 409": (r) => r.status === 201 || r.status === 409,
  });
  if (!success) {
    console.warn(`VU ${__VU}: unexpected status ${res.status} body=${res.body}`);
  }
}
