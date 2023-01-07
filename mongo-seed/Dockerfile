FROM mongo

COPY agents.json /agents.json
CMD mongoimport --host mongo --db cwt --collection agents --type json --file /agents.json --jsonArray