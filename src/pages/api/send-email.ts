// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.API_KEY_SENDGRID as string);

type Data = {
  response?: any;
	error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
	if (req.method !== 'POST') {
    res.status(405).send({ error: 'Only POST requests allowed' })
    return
  }
	let response;

	const { key, name, email } = req.body

	const subject = `Request a payment link to get credits -> any2chat`;
	const txt = `You have requested one generation - logo.artmelon.me, <br/>
	step: ${key},<br/>
	user: ${name}, ${email}, <br/><br/>
	
	Do you want to get credits?,<br/><br/>

	10 credits, 5USD<br/>
	
	Respond yes and we will send you the payment link.<br/><br/>
	
	Juan Granados:<br/>
	* https://twitter.com/juandavid_gf,<br/>
	* https://www.linkedin.com/in/juandavidgf/<br/>`;

	const msg = {
		to: email, // Recipient
		from: 'support@artmelon.me', // Verified sender
		cc: ['juan@artmelon.me', 'juanchoda12@gmail.com'],
		subject: subject,
		text: txt,
		html: `<strong>${txt}</strong>`,
	};

	try {
		response = await sgMail.send(msg);
		console.log('notify-suscriptor#response', response);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: (error as Error).message || 'An error occurred on the server.' })
	}
}
