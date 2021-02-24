/* eslint-disable */
import axios from 'axios';
import swal from 'sweetAlert';

export const bookTour = async tourId => {
  const stripe = Stripe(
    'pk_test_51I3kB2CCmdQckf5r5h5ONV66sNA7AvYW9pZXRZv87qXUN0NNPfSVPLQmhIpnhDGDh1ck4jQoJqj0fkBoGlNikcKV006uV0OkBU'
  );
  try {
    const session = await axios({
      url: `http://127.0.0.1:8080/api/v1/bookings/create-checkout-session/${tourId}`
    });
    console.log(session);

    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (e) {
    console.log(e);
    swal(
      'Checkout Error!',
      `Sorry, we couldn't process your request for booking the tour! Please try again later.`,
      'error',
      {
        timer: 4000
      }
    );
  }
};
