# Cron Parser Application

Small Application to parse cron expressions and show result in human readable format

## Features

 - Supports *, /, - expressions
 - Accepted values for minutes are 0-59
 - Accepted values for hours are 0-23
 - Accepted values for days are 1-31
 - Accepted values for months are 1-12
 - Accepted values for days of week are 1-7
 - For months short names are supported JAN is treated as 1 and DEC is treated as 12
 - For days in a week short names are supported and SUN is treated as 1 and SAT is treated as 7
 - Short names can be used whithin months or days of weeks expression section and would be treated as their appropriate number
 - Supports multiple expression within each section seperated by comma and any repeated values will be made unique and sorted
 - Return Invalid expression error for any violation in the expression such as giving unsupported special characters, floating point numbers e.t.c

## Requirements

 - [Node v12.15.0+](https://nodejs.org/en/download/current/)

## Getting Started

Clone the repo:

```bash
git clone https://github.com/ISrikaanth/CronParser.git
cd cronparser
```

Install dependencies:

```bash
npm install
```

## Running Locally

```bash
node src/parser.js "<enter cron expression here>"
```

## Documentation

```bash
# generate and open api documentation
npm run docs
```
