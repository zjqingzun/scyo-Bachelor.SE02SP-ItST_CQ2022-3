import { Injectable } from "@nestjs/common";

const bcrypt = require('bcrypt');
const saltRounds = 10;

export const hashPassword = async (plainPassword : string) => {
    try {
        return await bcrypt.hash(plainPassword, saltRounds);
    } catch (error) {
        console.log(error);
    }
}

export const comparePassword = async (plainPassword : string, hashPassord: string) => {
    try {
        return await bcrypt.compare(plainPassword, hashPassord);
    } catch (error) {
        console.log(error);
    }
}

