import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const movieSchema = new Schema({

    Email: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    MoviesBooked: [{
        Language: {
            type: String,
            required: true
        },
        MovieName: {
            type: String,
            required: true
        },
        Day: {
            type: String,
            required: true
        },
        Time: {
            type: String,
            required: true
        },
        TotalSeat: {
            type: String,
            required: true
        },
        TotalPrice: {
            type: String,
            required: true
        },
        ImgUrl: {
            type: String,
            required: true
        },

    }]
})

const MovieSchema = new model('MovieSchema', movieSchema)
export default MovieSchema;