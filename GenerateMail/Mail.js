import nodeMailer from 'nodemailer';


async function generateMail(userData) {

    const transporter = nodeMailer.createTransport({
        service: "gmail",
        // use a SMTP server like Gmail or Outlook for sending emails, etc...
        secure: false,
        auth: {
            user: process.env.MyEmail,
            pass: process.env.MyPassword
        }
    });

    let mailMessage = {
        from: process.env.MyEmaiL,
        to: userData.Email,
        subject: "Movie Booked Successfully!",
        html: `<h1>Thank you for Booking the Movie</h1>
               <h3><u>Your Details</u></h3>
               <h4>Name : ${userData.Name}</h4>
               <h4>Movie-Name : ${userData.MoviesBooked[0].MovieName}</h4>
               <h4>Language : ${userData.MoviesBooked[0].Language}</h4>
               <h4>Time : ${userData.MoviesBooked[0].Time}</h4>
               <h4>Day : ${userData.MoviesBooked[0].Day}</h4>
               <h4>Total Seats Booked : ${userData.MoviesBooked[0].TotalSeat}</h4>
               <h4>Total Cost : ${userData.MoviesBooked[0].TotalPrice}</h4>
            `
        ,
    };
    var msg;
    console.log(mailMessage)
    await transporter
        .sendMail(mailMessage)
        .then(() => {
            msg = "you should receive an email from us.";
            return msg;
        })
        .catch((error) => {
            msg = "There's an Error! Please try again Later.";
            console.error(error);
            return msg;
        });


}


export default generateMail