const { match } = require('assert');
const express = require('express');
const app = express();
const router = express.Router()
app.use(express.json());

const port = 4000;



app.post('/createpdf',async (req,res)=>{
   let rescheck= await createPdf(req.body);
   console.log(rescheck);
   if(rescheck.status == 'success'){
       res.send({status:'success',message:'Certificate create successfully'});
   }else{
    res.send({status:'error'});
   }
});



function createPdf(perms){

 try{

 let ts =  Date.now();
    const pdfkit = require('pdfkit');
    const fs = require('fs');
    const doc = new pdfkit({size:'A4', margins: { top: 50,  bottom: 50,  left: 72,  right: 72  },layout:"landscape"});

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = today.getFullYear();
    const h = today.getMonth();
    const m = today.getMinutes();

    const formattedDate = `${year}-${month}-${day} ${h}:${m}:00`;


let pdfName = `${perms.name}_${ts}.pdf`;

doc.pipe(fs.createWriteStream('./pdfFolder/'+pdfName));


doc.rect(10, 10, doc.page.width - 20, doc.page.height - 20).lineWidth(10).strokeColor('#0099cc').stroke();


doc.fontSize(14).fillColor('black');

doc.text('Register-Id:- ' + Math.random().toFixed(7).split('.')[1], 30, 50);
doc.text('E-Mail: ' + perms.email, 30, 70);
doc.text('Phone No.: ' +perms.mobile, 30, 90);


doc.text(perms.address1, 620, 50);
doc.text(perms.address2, 620, 70);
doc.text(perms.address3, 620, 90);

doc.image('./logoMSME.jpg', 300, 30, { align: 'center', width: 150 })


doc.fontSize(32).fillColor('#0099cc').font('Times-Roman').text('Certificate of Half Marathon', 0, 230, {
  align: 'center',
});


doc.moveDown();
doc.fontSize(16).fillColor('black').text('This Certificate Presented to', {
  align: 'center',
});
doc.fontSize(22).fillColor('#b1903b').text(perms.name, {
  align: 'center',
});

doc.moveDown(0.5);
doc.fontSize(12).fillColor('black').text(
  'The certificate of achievement is awarded to individuals who have\n' +
    'demonstrated outstanding performance in their field. Here’s an example text\n' +
    'for a certificate.',
  { align: 'center' }
);


doc.fontSize(12);
doc.text('Date of Birth: '+ perms.dob, 80, 400);
doc.text('Gender: '+ perms.gender, 360, 400);
doc.text('Blood Group: ' + perms.gender , 620, 400);


doc.text(formattedDate, 80, 470);
doc.text('_________________________', 80, 480);
doc.text('DATE-TIME', 125, 495);


doc.text('_________________________', 600, 480);
doc.text('SIGNATURE', 650, 495);


doc.image('./certified.jpg', 322, 400, { align: 'center', width: 150 })

doc.end();
return {status:'success'}

 } catch(err){
    console.log(err)
    return {status:'error'}
 }




}






app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})