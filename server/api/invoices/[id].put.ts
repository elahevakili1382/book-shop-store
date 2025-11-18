export default defineEventHandler(async (event) => {
  const params = getRouterParams(event)
  const id = params.id
    const body = await readBody(event);

  return {
    message: "Invoice updated",
    invoice: {
      id,
      ...body
    }
  };
});
