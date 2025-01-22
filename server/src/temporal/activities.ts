export async function activity1() {
  console.log('activity1');
  return 'done';
}
export async function activity2() {
  console.log('activity2');
  return 'done';
}
export async function activity3(retry?: boolean) {
  console.log('activity3');
  if (!retry) {
    throw new Error('activity3 error');
  }
  return 'done';
}
export async function activity4() {
  console.log('Workflow completed');
  return 'done';
}
