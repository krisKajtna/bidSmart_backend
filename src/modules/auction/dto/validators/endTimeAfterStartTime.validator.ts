import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator';

export function IsEndTimeAfterStartTime(property: string, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'isEndTimeAfterStartTime',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return new Date(value) > new Date(relatedValue);
                },
                defaultMessage(args: ValidationArguments) {
                    return 'endTime must be after startTime';
                },
            },
        });
    };
}
