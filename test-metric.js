const records = [
  '100,0',
  '120,0',
  '80,0',
  '100,1,this is a warning',
  '50,2,this is an error',
];
let index = 0;

setInterval(() => {
  console.log(records[index]);
  index++;
  index = index % records.length;
}, 500);
