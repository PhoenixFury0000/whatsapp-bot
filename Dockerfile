FROM quay.io/vorterx/xastral:latest
RUN git clone https://github.com/naxordeve/whatsapp-bot /root/xastral/
WORKDIR /root/xastral/
RUN yarn install --network-concurrency 1
CMD ["npm", "start"]
