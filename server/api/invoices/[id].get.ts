export default defineEventHandler((event) => {
  const params = getRouterParams(event)
  const id = params.id
  return {
    id,
    client: "Sample Client",
    email: "sample@mail.com",
    start: "2024-01-01",
    due: "2024-01-10",
    amount: 99.99,
    status: "Paid",
  };
});
