const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
const rootReference = functions.database.ref('tasks/{id}');

exports.onTaskCreate = rootReference.onCreate((snapshot, context) => {
    const task = snapshot.val();
    const key = context.params.id;
    const newObj = { createdAt: context.timestamp }
    const log = Object.assign(newObj, task);
    
    return admin.database().ref(`/logs/${key}`).set(log);
});

exports.onTaskDelete = rootReference.onDelete((snapshot, context) => {
    const task = snapshot.val();
    const key = context.params.id;
    const newObj = { deletedAt: context.timestamp }
    const log = Object.assign(newObj, task);

    return admin.database().ref(`/logs/${key}`).update(log);
});

exports.onTaskUpdate = rootReference.onUpdate((snapshot, context) => {
    const task = snapshot.after.val();
    const key = context.params.id;
    const newObj = { updatedAt: context.timestamp }
    const log = Object.assign(newObj, task);

    return admin.database().ref(`/logs/${key}`).update(log);
});
