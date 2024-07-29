/**
 * write a function that returns the majority element.
 * The majority element is the element that appears more than other element.
 * READ EXAMPLE BELOW!

console.log(majorityElement([3, 2, 3])); // Output: 3 
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // Output: 2 

 * You may assume that the majority element always exists in the array.

 * Returns the majority element from the input array of integers.

 * @param {number[]} nums - The input array of integers.
 * @return {number} Returns the majority element.
 */
function majorityElement(nums) {
  let groupElement = {};
  let maxValue = 0;
  let majorityElement = {
    element: [],
    value: [],
  };

  for (index in nums) {
    if (nums[index] in groupElement) {
      groupElement[nums[index]]++;
      continue;
    }
    groupElement[nums[index]] = 1;
  }

  for (key in groupElement) {
    if (groupElement[key] > maxValue) {
      maxValue = groupElement[key];
    }
  }

  for (key in groupElement) {
    if (groupElement[key] === maxValue) {
      majorityElement['element'].push(key);
      majorityElement['value'].push(groupElement[key]);
    }
  }
  return majorityElement['element'];
}

console.log(majorityElement([3, 2, 3])); // Output: 3
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // Output: 2
