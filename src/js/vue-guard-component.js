let guardConfig = {
    path: '/api/v1/route/access',
}

const guard = {
    data () {
        return {
            show: false
        }
    },
    computed: {
        ajaxUrl () {
            if (this.url !== undefined && this.url !== null) {
                return this.url;
            } else {
                return guardConfig.path;
            }
        }
    },
    render (createElement) {
        if (this.show && this.$slots.default !== undefined) {
            return this.$slots.default[0];
        } else {
            return;
        }
    },
    created () {
        this.$http.post(this.ajaxUrl, { resource: this.resource }).then(response => {
            if (JSON.parse(response.data)) {
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
        }
    }
}

export default guard;

export { guardConfig };
