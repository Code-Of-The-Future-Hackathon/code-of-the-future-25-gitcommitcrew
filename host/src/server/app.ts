import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import mainRouter from "@/server/routes/index";

const app = express();

app.set("trust proxy", 1);

app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors());

app.use(
	rateLimit({
		windowMs: 1000,
		limit: 15,
		standardHeaders: "draft-7",
		legacyHeaders: false,
		validate: { xForwardedForHeader: false },
	}),
);

app.use(mainRouter);

const server = http.createServer(app);

const startServer = async (port: number) => {
	server.listen(port);
};

export { startServer };
