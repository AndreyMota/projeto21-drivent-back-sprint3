import { prisma } from "@/config";
import { notFoundError, paymentRequiredError, unauthorizedError } from '@/errors';

async function getHotels(userId: number) {
  try {
    // Verifica se o usuário está autenticado
    if (!userId) {
      throw unauthorizedError();
    }

    // Verifica se o usuário tem uma inscrição com um ticket pago que inclua a hospedagem
    const userEnrollment = await validateUserEnrollmentTicketPaidAndIncludesHotelOrFail(userId);

    // Se chegou até aqui, retorna a lista de hotéis
    const hotels = await prisma.hotel.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        /* Rooms: {
          select: {
            id: true,
            name: true,
            capacity: true,
            createdAt: true,
            updatedAt: true,
          },
        }, */
      },
    });
    if (!hotels) {
      throw notFoundError();
    }
    return hotels;
  } catch (error) {
    throw error; // Repasse qualquer erro para ser tratado no controlador
  }
}

async function validateUserEnrollmentTicketPaidAndIncludesHotelOrFail(userId: number) {
  // Busca a inscrição do usuário
  const userEnrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
    },
    include: {
      Ticket: {
        include: {
          TicketType: true,
        },
      },
    },
  });

  // Verifica se existe uma inscrição
  if (!userEnrollment) {
    throw notFoundError();
  }

  if (!userEnrollment.Ticket){
    throw notFoundError();
  }


  // Verifica se o ticket está pago
  if (userEnrollment.Ticket.status != 'PAID') {
    throw paymentRequiredError('Ticket not paid');
  }

  if (userEnrollment.Ticket.TicketType.isRemote) {
    throw paymentRequiredError('Ticket is remote')
  }

  // Verifica se o ticket inclui hospedagem
  if (!userEnrollment.Ticket.TicketType.includesHotel) {
    throw paymentRequiredError('Ticket does not include hotel');
  }
  

  return userEnrollment;
}

export const hotelsService = {
  getHotels,
};
