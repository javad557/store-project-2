import http from 'k6/http';
import { check, sleep } from 'k6';

export default function () {
    // POST: Create a new banner
    let postRes = http.post(`${__ENV.url_base}/brands`, JSON.stringify({
        name: 'Test Banner ' + Date.now(),
        description: 'Test description'
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
    check(postRes, {
        'Status code is 201': (r) => r.status === 201,
        'Response has id': (r) => {
            console.log('POST response:', r.body);
            return r.status === 201 && JSON.parse(r.body).id !== undefined;
        }
    });

    if (postRes.status !== 201) {
        console.log('POST failed with status:', postRes.status, 'body:', postRes.body);
        return;
    }

    let newId = JSON.parse(postRes.body).id;

    // PUT: Update the new banner
    let putRes = http.put(`${__ENV.url_base}/brands/${newId}`, JSON.stringify({
        name: 'Updated Banner ' + Date.now(),
        description: 'Updated description'
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
    check(putRes, {
        'Status code is 200': (r) => r.status === 200,
        'Response has updated name': (r) => {
            console.log('PUT response:', r.body);
            return r.status === 200 && JSON.parse(r.body).name.includes('Updated Banner');
        }
    });

    // DELETE: Delete the new banner
    let delRes = http.del(`${__ENV.url_base}/brands/${newId}`, null);
    check(delRes, {
        'Status code is 204': (r) => r.status === 204,
        'Response is empty': (r) => r.body.length === 0
    });

    // GET: Test index
    let getRes = http.get(`${__ENV.url_base}/brands`);
    check(getRes, {
        'Status code is 200': (r) => r.status === 200,
        'Response is JSON': (r) => r.headers['Content-Type'].includes('application/json'),
        'Response is an array': (r) => Array.isArray(JSON.parse(r.body))
    });

    sleep(1);
}