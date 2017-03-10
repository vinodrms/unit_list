## How to add a patch

1. Add in the `list` folder a patch class with the name `P{Incremented_Number}_{Descriptive_name}`
2. Add the `{Descriptive_name}` as an enum value in the `MongoPatchType` Enum
3. Add the new patch class in the list of patches from `MongoPatchUtils`
4. Implement the logic of the patch and call at the end the `resolve` or `reject` function

## Notes

Patches need to have consecutive numbers, always use the biggest patch number and increment it with 1.

Each patch must extend the `ATransactionalMongoPatch` abstract class. Patches must be designed in such a way that they can be ran more than once as the multiple updates queries are not transactional in MongoDB.

All the patches that return with success (by calling the `resolve` callback) are saved in the `SystemPatches` collection. 

At the same time, only one process will be able to apply patches. Locking is ensured using the `lock` attribute from `SystemPatches`. If this is `1`, no new process will be able to add patches.

MongoDB does not support some operations with simple update queries, so sometimes we need to iterate through all the objects from the database alter them in memory and save them back to the database. `ABookingGroupTransactionalMongoPatch` is an abstract class created for such a use case, that reads documents in chunks and writes them back. When needed, we can create similar classes for other collections.