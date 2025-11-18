export default defineEventHandler((event) => {
  const params = getRouterParams(event)
  const id = params.id
  return {
    message: "Invoice deleted",
    id
  };
});
