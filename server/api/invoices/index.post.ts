export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  return {
    message: "Invoice created successfully",
    invoice: {
      ...body,
      id: `INV-${Date.now()}`,  // تولید ID
    },
  };
});
