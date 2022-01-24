-- Table: public.subscribers

-- DROP TABLE public.subscribers;

CREATE TABLE IF NOT EXISTS public.subscribers
(
    id integer NOT NULL DEFAULT nextval('subscribers_id_seq'::regclass),
    email text COLLATE pg_catalog."default" NOT NULL,
    is_subscribed boolean NOT NULL,
    date_added timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_updated timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT subscribers_pkey PRIMARY KEY (id),
    CONSTRAINT "email unqiue" UNIQUE (email)
        INCLUDE(email)
)

-- Trigger: updateSubscribers

-- DROP TRIGGER "updateSubscribers" ON public.subscribers;

CREATE TRIGGER "updateSubscribers"
    BEFORE UPDATE OF email, is_subscribed
    ON public.subscribers
    FOR EACH ROW
    EXECUTE FUNCTION public.date_updated();