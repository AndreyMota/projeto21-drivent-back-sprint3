import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driven.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }

  const remoteTicketType = await prisma.ticketType.create({
    data: {
      name: "Remote Ticket",
      price: 50, // Defina o preço desejado
      isRemote: true,
      includesHotel: false,
    },
  });

  const localTicketType = await prisma.ticketType.create({
    data: {
      name: "Local Ticket with Hotel",
      price: 100, // Defina o preço desejado
      isRemote: false,
      includesHotel: true,
    },
  });

  console.log({ event, remoteTicketType, localTicketType });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
