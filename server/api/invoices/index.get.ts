export default defineEventHandler(() => {
  return [
    {
      id: "INV-10022204-001",
      client: "Kamisato Ayaka",
      email: "Ayaka@gmail.com",
      start: "2024-02-12",
      due: "2024-02-19",
      amount: 95.66,
      status: "Paid",
    },
    {
      id: "INV-10022204-002",
      client: "Kamisato Ayato",
      email: "Ayato@gmail.com",
      start: "2024-02-10",
      due: "2024-02-17",
      amount: 47.44,
      status: "Pending",
    },
    {
      id: "INV-10022204-003",
      client: "Raiden Shogun",
      email: "Raiden@gmail.com",
      start: "2024-02-08",
      due: "2024-02-15",
      amount: 48.44,
      status: "Paid",
    },
    {
      id: "INV-10022204-004",
      client: "El Maulina",
      email: "Maulina@gmail.com",
      start: "2024-02-06",
      due: "2024-02-13",
      amount: 43.44,
      status: "Unpaid",
    }
  ];
});
