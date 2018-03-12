let guardConfig = {
    path: '/api/v2/route/access',
    property: 'id',
    authFunction: function () {}
};

const guard = {
    data () {
        return {
            show: false
        };
    },
    computed: {
        ajaxUrl () {
            if (this.url !== undefined && this.url !== null) {
                return this.url;
            } else {
                return guardConfig.path;
            }
        },
        postData () {
            if (this.value !== undefined) {
                return {
                    resource: this.resource,
                    property: this.property,
                    value: this.value,
                };
            } else {
                return { resource: this.resource };
            }
        },
        noAccessSlot () {
            if (this.$slots.noAccess !== undefined) {
                return this.$slots.noAccess;
            } else if (this.$slots.default !== undefined) {
                return this.$slots.default.find((slot) => {
                    return slot.data !== undefined && slot.data.slot === 'noAccess';
                });
            }

            return undefined;
        },
    },
    render () {
        if (this.show && this.$slots.default !== undefined) {
            return this.$slots.default[0];
        } else if (this.noAccessSlot !== undefined) {
            return this.noAccessSlot;
        } else {
            return;
        }
    },
    created () {
        guardConfig.authFunction(this.ajaxUrl, this.postData, (accepted) => {
            if (accepted === 'error') {
                this.$emit('guard-error');
            } else if (accepted) {
                this.show = true;
                this.$emit('guard-accepted');
            } else {
                this.$emit('guard-denied');
            }
        });
    },
    props: {
        url: {
            type: String,
            required: false,
        },
        resource: {
            type: String,
            required: true,
        },
        property: {
            type: String,
            required: false,
            default: guardConfig.property,
        },
        value: {
            required: false,
        }
    }
};

export default guard;

export { guardConfig };
