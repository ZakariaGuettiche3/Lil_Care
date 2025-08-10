
import { ChargilyClient } from '@/vendor/chargily/src/classes/client';
import {CHARGILIY_SK} from "@/lib/constant";



if (!CHARGILIY_SK) {

    throw new Error("chargily Api key is not defined");
}

const client = new ChargilyClient({
  api_key: CHARGILIY_SK,
  mode: 'test', // Change to 'live' when deploying your application
});

declare global {
    var chargily : ChargilyClient;
}

export const chargily = globalThis.chargily || client ;



