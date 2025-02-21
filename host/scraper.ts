import { get } from "systeminformation";

/*
Init: const scraper = new Scraper({cpu: "speed, voltage"}, 400)
Update: scraper.update({...scraper.query, mem: "cached"}, 5000)
Kill: scrapper.kill()
*/

class Scraper {
  timer: number;
  query: object;
  interval: any;

  start(): void {
    this.interval = setInterval(
      // TODO: Implement info forwarding to server
      async () => get(this.query).then(console.log),
      this.timer,
    );
  }

  update(query: object, timer: number): void {
    this.query = query
    this.timer = timer;
    clearInterval(this.interval);
    this.start()
  }

  kill(): void {
    clearInterval(this.interval)
    console.log(this.interval)
  }

  constructor(query: object, timer: number) {
    this.query = query;
    this.timer = timer;
    this.start()
  }
}

// const scrapper = new Scraper({cpu: "speed"}, 500)
// setTimeout(() => scrapper.update({...scrapper.query, mem: "cached"}, 1000), 5000)
// setTimeout(() => scrapper.kill(), 8000)